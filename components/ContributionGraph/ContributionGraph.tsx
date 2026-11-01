import { githubUrl, githubUsername } from "@/content";
import { getContributions } from "@/lib/github";
import { ContributionGraphView } from "./ContributionGraphView";

// Server component: fetches (cached daily) and hands plain data to the client view.
export async function ContributionGraph() {
  const data = await getContributions(githubUsername());
  return <ContributionGraphView data={data} profileUrl={githubUrl()} />;
}
