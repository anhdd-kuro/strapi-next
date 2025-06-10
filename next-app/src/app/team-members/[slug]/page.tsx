import qs from "qs";

import { BlockRenderer, TeamPageBlock } from "@/app/components/blocks";
import { fetchCMS } from "@/utils/api";

async function getTeamMember(slug: string) {
  const urlParams = {
    populate: {
      photo: {
        fields: ["alternativeText", "name", "url"],
      },
      blocks: {
        on: {
          "blocks.testimonial": {
            populate: {
              photo: {
                fields: ["alternativeText", "name", "url"],
              },
            },
          },
          "blocks.spoiler": {
            populate: true,
          },
          "blocks.rich-text": {
            populate: true,
          },
        },
      },
    },
    filters: {
      slug: {
        $eq: slug, // This is the slug for our team member
      },
    },
  };

  const teamMembers = await fetchCMS<{
    data: UserProfile[];
  }>({
    path: "/api/team-members",
    urlParams,
  });

  console.dir(teamMembers, { depth: null });
  return teamMembers.data[0];
}

interface UserProfile {
  id: number;
  documentId: string;
  name: string;
  description: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string | null;
  photo: {
    id: number;
    alternativeText: string;
    name: string;
    url: string;
  };
  /**
   * A list of blocks (content elements) associated with this team member.
   * The type of each block is determined by its `__component` property.
   * The structure of each block is determined by the component implementation.
   * The blocks are sorted by their `order` property.
   */
  blocks: TeamPageBlock[];
}

export default async function TeamMemberDetail({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  if (!slug) return <p>No member found</p>;

  const teamMember = await getTeamMember(slug);
  console.log(`🚀 \n - teamMember:`, teamMember);

  return (
    <div className="container mx-auto px-4">
      {teamMember.blocks.map((block: TeamPageBlock, index: number) => (
        <BlockRenderer key={`${block.id}_${index}`} block={block} />
      ))}
    </div>
  );
}
