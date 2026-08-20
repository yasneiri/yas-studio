// Shared nav data — combines model catalogs and re-exports helpers
// used by both TopNav and page.tsx so they stay in sync.
import {
  VIDEO_MODELS, VEO_MODELS, IMAGE_MODELS, AUDIO_MODELS, TEMPLATES,
  MODEL_THUMBNAILS, DEFAULT_THUMBNAIL, PROVIDER_COLORS, TAG_STYLES,
  type Model, type Template,
} from "@/lib/models";

export const ALL_VIDEO: Model[] = [...VIDEO_MODELS, ...VEO_MODELS];

export {
  VIDEO_MODELS, VEO_MODELS, IMAGE_MODELS, AUDIO_MODELS, TEMPLATES,
  MODEL_THUMBNAILS, DEFAULT_THUMBNAIL, PROVIDER_COLORS, TAG_STYLES,
};
export type { Model, Template };

