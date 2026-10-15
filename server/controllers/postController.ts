import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import { GoogleGenAI } from "@google/genai";
import axios from "axios";
import { Generation } from "../models/Generation.js";
import { cloudinary } from "../config/cloudinary.js";
import { Post } from "../models/Post.js";

//generate post
//POST /api/posts/generate
export const generatePost = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { prompt, tone, generateImage } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      res.status(400).json({
        message:
          "Gemini API key is missing. Please add it to your server/.env file.",
      });
      return;
    }

    const ai = new GoogleGenAI({ apiKey });

    // 1. Generate post text and image prompt
    const textResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a social media post based on this prompt: '${prompt}'.
Tone: ${tone}.
Include relevant hashtags.
Return your response in strict JSON format with "content" and "imagePrompt" fields without markdown fences:
{
  "content": "...",
  "imagePrompt": "..."
}`,
    });

    let content = "";
    let imagePrompt = prompt;

    try {
      const rawText = textResponse.text || " ";
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      const data = jsonMatch
        ? JSON.parse(jsonMatch[0])
        : {
            content: rawText,
            imagePrompt: prompt,
          };
      content = data.content;
      imagePrompt = data.imagePrompt;
    } catch (e) {
      content = textResponse.text || "";
    }

    //2. Generate image if requested
    let mediaUrl = "";
    if (generateImage) {
      try {
        const pollinationKey = process.env.POLLINATION_API_KEY;
        if (pollinationKey) {
          //use pollination.ai for image generation
          const pollinationResponse = await axios.post(
            "https://gen.pollinations.ai/v1/images/generations",
            {
              model: "black-forest-labs/flux.1-schnell",
              prompt: imagePrompt,
              n: 1,
              size: "1024x1024",
              response_format: "url",
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${pollinationKey}`,
              },
              timeout: 120000,
            },
          );

          const tempUrl =
            pollinationResponse.data?.data?.[0]?.url ||
            pollinationResponse.data?.url ||
            "";

          // Upload image to Cloudinary for persistence
          if (tempUrl) {
            const uploadRes = await cloudinary.uploader.upload(tempUrl, {
              folder: "ai-generations",
              resource_type: "image",
            });
            mediaUrl = uploadRes.secure_url;
          }
        }
      } catch (error) {
        console.error("Image generation/Cloudinary upload error:", error);
      }
    }

    // 3. Save geneartions to database
    const generation = await Generation.create({
      user: req.user?._id,
      prompt,
      content,
      mediaUrl: mediaUrl || undefined,
      mediaType: mediaUrl ? "image" : undefined,
      tone,
    });

    res.json(generation);
  } catch (error: any) {
    console.error("generatePost error:", error);
    res.status(500).json({
      message: error?.message || "Failed to generate post.",
    });
  }
};

//get generations
//GET /api/posts/generations
export const getGenerations = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const generations = await Generation.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(generations);
  } catch (error: any) {
    res.status(500).json({
      message: error.message?.message || "Server error",
    });
  }
};

//get posts
//GET /api/posts/posts
export const getPosts = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const posts = await Post.find({ user: req.user._id });
    res.json(posts);
  } catch (error: any) {
    res.status(500).json({
      message: error.message?.message || "Server error",
    });
  }
};

//schedule posts
//POST /api/posts
export const schedulePosts = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { content, platforms, scheduledFor, status } = req.body;
    //parse the platforms if it comes as a stringified array from FormData
    let parsedPlatfroms = platforms;
    if (typeof platforms === "string") {
      try {
        parsedPlatfroms = JSON.parse(platforms);
      } catch (error) {
        parsedPlatfroms = platforms.split(",");
      }
    }

    let mediaUrl: string | undefined = req.body.mediaUrl;
    let mediaType: "image" | "video" | undefined = req.body.mediaType;

    if (req.file) {
      const result = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "auto", folder: "social-scheduler" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );
        stream.end(req.file!.buffer);
      });

      mediaUrl = result.secure_url;
      mediaType = result.resource_type === "video" ? "video" : "image";
    }
    const post = await Post.create({
      user: req.user._id,
      content,
      platforms: parsedPlatfroms,
      mediaUrl,
      mediaType,
      scheduledFor,
      status,
    });
    res.status(201).json(post);
  } catch (error: any) {
    res.status(500).json({
      message: error.message?.message || "Server error",
    });
  }
};
