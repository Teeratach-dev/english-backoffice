"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function TopicGroupsRedirectPage() {
  const router = useRouter();
  const params = useParams();
  const unitId = params.unitId as string;
  const topicId = params.topicId as string;

  useEffect(() => {
    async function redirect() {
      try {
        const res = await fetch(`/api/units/${unitId}`);
        if (!res.ok) throw new Error("Failed to fetch unit data");
        const unit = await res.json();

        if (unit.courseId) {
          router.replace(
            `/courses/${unit.courseId}/units/${unitId}/topics/${topicId}/groups`,
          );
        } else {
          toast.error("Course not found for this unit");
          router.replace("/units");
        }
      } catch (error) {
        console.error("Redirect error:", error);
        toast.error("Error during redirection");
        router.replace("/topics");
      }
    }

    if (unitId && topicId) {
      redirect();
    }
  }, [unitId, topicId, router]);

  return (
    <div className="space-y-4 p-8">
      <h1 className="text-xl font-semibold">Redirecting to topic details...</h1>
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}
