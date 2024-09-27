import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";
import { VideoRatio } from "@/types";

const ffmpeg = new FFmpeg();

export async function transcodeVideo(
  inputBlob: Blob,
  ratio: VideoRatio,
  progressCallback: ({ progress }: { progress: number }) => void
): Promise<Blob> {
  if (!ffmpeg.loaded) {
    const baseURL = "https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm";
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      ),
      workerURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.worker.js`,
        "text/javascript"
      ),
    });
  }

  const inputName = "input.mp4";
  const outputName = "output.mp4";

  // Convertir le Blob en ArrayBuffer
  const arrayBuffer = await inputBlob.arrayBuffer();
  await ffmpeg.writeFile(inputName, new Uint8Array(arrayBuffer));

  // Calculer les dimensions en fonction du ratio
  let outputSize: string;
  switch (ratio) {
    case VideoRatio.SQUARE:
      outputSize = "1080:1080";
      break;
    case VideoRatio.LANDSCAPE:
      outputSize = "1920:1080";
      break;
    case VideoRatio.PORTRAIT:
      outputSize = "1080:1920";
      break;
    default:
      outputSize = "1920:1080"; // Par défaut, on garde le ratio 16:9
  }

  ffmpeg.on("progress", data => {
    progressCallback(data);
  });

  const numThreads = navigator.hardwareConcurrency || 4;

  console.log(numThreads);

  // Commande FFmpeg pour transcoder la vidéo
  await ffmpeg.exec([
    "-i",
    inputName,
    "-vf",
    `scale=${outputSize}:force_original_aspect_ratio=decrease,pad=${outputSize}:(ow-iw)/2:(oh-ih)/2,setsar=1`,
    "-c:v",
    "libx264",
    "-preset",
    "veryfast",
    "-crf",
    "23",
    "-c:a",
    "aac",
    "-b:a",
    "128k",
    "-movflags",
    "+faststart",
    "-r",
    "30",
    "-threads",
    numThreads.toString(), // Utiliser le nombre de threads détecté
    outputName,
  ]);

  const data = await ffmpeg.readFile(outputName);
  return new Blob([data], { type: "video/mp4" });
}
