"use client"

import { use } from "react";
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Toolbar } from "@/components/toolbar"
import { Cover } from "@/components/cover"
import { Skeleton } from "@/components/ui/skeleton";
import Editor from "@/components/editor"
import dynamic from "next/dynamic";
import { useMemo } from "react";

interface DocumentIdPageProps {
  params: Promise<{
    documentId: Id<"documents">;
  }>;
}

const DocumentPageId = ( {params}:DocumentIdPageProps ) => {
    const Editor = useMemo(
      () => dynamic(() => import("@/components/editor"), { ssr: false }),
      [],
    );  
    const { documentId } = use(params);

    const document = useQuery(api.documents.getById, {
      documentId,
    });

    const update = useMutation(api.documents.update);
    
    const onChange = (content: string) => {
      update({
        id: documentId,
        content,
      });
    };

    if (document === undefined) {
      return (
        <div>
          <Cover.Skeleton />
          <div className="mx-auto mt-10 md:max-w-3xl lg:max-w-4xl">
            <div className="space-y-4 pl-8 pt-4">
              <Skeleton className="h-14 w-1/2" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-2/5" />
              <Skeleton className="h-4 w-3/5" />
            </div>
          </div>
        </div>
      );
    }
    
    if (document === null) {
      return <div>Not Found</div>
    }    
    return ( 
        <div className="pb-40">
            <Cover url={document.coverImage}/>
            <div className="md:max-w-3xl lg:md-max-w-4xl mx-auto">
                <Toolbar initialData={document}/>
                <Editor onChange={onChange} initialContent={document.content} />
            </div>
        </div>
    );
}
 
export default DocumentPageId;