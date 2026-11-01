import { connection } from "next/server";
import { getPublicTeamAction } from "./aboutActions";
import AboutTeamClient from "./AboutTeamClient";

export default async function AboutTeam() {
  await connection();

  const people = await getPublicTeamAction();

  return <AboutTeamClient people={people} />;
}