import LearnLanguageClient from "./LearnLanguageClient";

export default async function LanguageSectionsPage({ params }: { params: Promise<{ language: string }> }) {
  const resolvedParams = await params;
  return <LearnLanguageClient params={resolvedParams} />;
}
