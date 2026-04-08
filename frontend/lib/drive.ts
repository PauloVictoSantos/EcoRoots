// lib/drive.ts
// Helper para buscar arquivos de uma pasta pública do Google Drive.
// Requer: NEXT_PUBLIC_... NÃO — usamos server-side, então sem NEXT_PUBLIC.
// Variáveis: GOOGLE_DRIVE_API_KEY, GOOGLE_DRIVE_ROOT_FOLDER_ID

export type DriveFile = {
  id: string;
  name: string;
  mimeType: string;
  kind: "image" | "video" | "pdf" | "other";
  thumbnailUrl: string;   // preview (imagens/vídeos/PDFs têm thumbnail do Drive)
  viewUrl: string;        // link pra abrir no Drive
  directUrl: string;      // link direto (útil pra <img>/<video>)
};

const DRIVE_API = "https://www.googleapis.com/drive/v3/files";

function classify(mimeType: string): DriveFile["kind"] {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType === "application/pdf") return "pdf";
  return "other";
}

function buildUrls(id: string, mimeType: string) {
  // Endpoint mais confiável pra imagens/thumbnails em pastas públicas
  const thumbnailUrl = `https://lh3.googleusercontent.com/d/${id}=w1000`;
  const viewUrl = `https://drive.google.com/file/d/${id}/view`;
  const directUrl = mimeType.startsWith("video/")
    ? `https://drive.google.com/file/d/${id}/preview`
    : thumbnailUrl;
  return { thumbnailUrl, viewUrl, directUrl };
}

async function driveFetch(params: Record<string, string>) {
  const rootId = process.env.NEXT_PUBLIC_GDRIVE_API_KEY;
  if (!rootId) throw new Error("NEXT_PUBLIC_GDRIVE_API_KEY não definida");

  const url = new URL(DRIVE_API);
  Object.entries({ ...params, key: rootId }).forEach(([k, v]) =>
    url.searchParams.set(k, v)
  );

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Drive API erro ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

/** Lista subpastas dentro de uma pasta. */
async function listSubfolders(parentId: string) {
  const data = await driveFetch({
    q: `'${parentId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: "files(id, name)",
    pageSize: "50",
    orderBy: "name",
  });
  return (data.files ?? []) as { id: string; name: string }[];
}

/** Lista arquivos (não-pasta) dentro de uma pasta. */
async function listFiles(parentId: string): Promise<DriveFile[]> {
  const data = await driveFetch({
    q: `'${parentId}' in parents and mimeType != 'application/vnd.google-apps.folder' and trashed = false`,
    fields: "files(id, name, mimeType, modifiedTime)",
    pageSize: "100",
    orderBy: "name",
  });

  const files = (data.files ?? []) as {
    id: string;
    name: string;
    mimeType: string;
  }[];

  return files.map((f) => {
    const kind = classify(f.mimeType);
    const urls = buildUrls(f.id, f.mimeType);
    return {
      id: f.id,
      name: f.name,
      mimeType: f.mimeType,
      kind,
      ...urls,
    };
  });
}

export type WeekData = {
  title: string;     // "Semana 1"
  folderId: string;
  files: DriveFile[];
};

/**
 * Busca todas as subpastas (semanas) da pasta raiz e seus arquivos.
 * Ordena por nome — então nomeie as pastas como "Semana 1", "Semana 2", etc.
 */
export async function fetchWeeks(): Promise<WeekData[]> {
  const rootId = process.env.NEXT_PUBLIC_GDRIVE_FOLDER_ID_DESEVOLVIMENTO;
  if (!rootId) throw new Error("NEXT_PUBLIC_GDRIVE_FOLDER_ID_DESEVOLVIMENTO não definida");

  const subfolders = await listSubfolders(rootId);

  const weeks = await Promise.all(
    subfolders.map(async (folder) => ({
      title: folder.name,
      folderId: folder.id,
      files: await listFiles(folder.id),
    }))
  );

  return weeks;
}