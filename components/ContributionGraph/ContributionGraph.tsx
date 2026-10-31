import { bankr, githubUrl, githubUsername } from "@/content";
import { getContributions } from "@/lib/github";
import { ContributionGraphView, type GraphView } from "./ContributionGraphView";

type Props = {
  initialView?: GraphView;
};

// Server component: fetches (cached daily) and hands plain data to the client view.
export async function ContributionGraph({ initialView = "all" }: Props) {
  const data = await getContributions(githubUsername(), bankr.repoName);
  return <ContributionGraphView data={data} initialView={initialView} profileUrl={githubUrl()} />;
}
