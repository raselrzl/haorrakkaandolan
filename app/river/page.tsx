import type { Metadata } from "next";
import RiverContent from "./RiverContent";

export const metadata: Metadata = {
  title: "মনু নদী রক্ষা | Protect the Monu River",
  description:
    "মৌলভীবাজারের নদ-নদী রক্ষা। Protect the Monu River and the waterways of Moulvibazar.",
};

export default function MoulvibazarPage() {
  return <RiverContent />;
}