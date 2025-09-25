import { getMySurveys } from "@/lib/api/surveys";

export default async function DashboardPage() {
  const surveys = await getMySurveys();
  return <pre>{JSON.stringify(surveys, null, 2)}</pre>;
}