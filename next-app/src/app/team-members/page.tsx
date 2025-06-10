import qs from "qs";
import Image from "next/image";
import Link from "next/link";
import { fetchCMS } from "@/utils/api";

async function getTeamMembers() {
  const res = await fetchCMS<{ data: TeamMemberProps[] }>({
    path: "/api/team-members",
    urlParams: {
      populate: {
        photo: {
          fields: ["alternativeText", "name", "url"],
        },
      },
    },
  });

  console.log(res);

  return res.data;
}

interface TeamMemberProps {
  id: number;
  documentId: string;
  name: string;
  description: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  photo: {
    id: number;
    documentId: string;
    alternativeText: string;
    name: string;
    url: string;
  };
}

function TeamMemberCard({
  name,
  description,
  photo,
  slug,
}: Readonly<TeamMemberProps>) {
  const imageUrl = `${
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:1337"
  }${photo.url}`;
  return (
    <Link
      href={`/team-members/${slug}`}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <Image
        src={imageUrl}
        alt={photo.alternativeText || name}
        width={500}
        height={500}
      />
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{name}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  );
}

export default async function OurTeam() {
  const teamMembers = await getTeamMembers();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Our Team</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teamMembers.map((member: TeamMemberProps) => (
          <li key={member.documentId}>
            <TeamMemberCard {...member} />
          </li>
        ))}
      </ul>
    </div>
  );
}
