import {
    useLoaderData,
    useResolvedPath,
    useRevalidator,
    useRouteLoaderData,
  } from "@remix-run/react";
  import { useEffect } from "react";
  import { useEventSource } from "remix-utils/sse/react";
  
  export function useLiveLoader<T>(params?: Record<string, string>) {
    const path = useResolvedPath("./stream");
    const searchParams = new URLSearchParams(params);
    const data = useEventSource(`${path.pathname}?${searchParams.toString()}`);
  
    const { revalidate } = useRevalidator();
  
    useEffect(() => {
      if (data) {
        console.log("[useLiveLoader] Received SSE data:", data);
      }
      revalidate();
      console.log("[useLiveLoader] Revalidation triggered");
      // eslint-disable-next-line react-hooks/exhaustive-deps -- "we know better" — Moishi
    }, [data]);
  
    return useLoaderData<T>();
  }

  export function useRouteLiveLoader<T>(route:string) {
    const path = useResolvedPath("./stream");
    const data = useEventSource(path.pathname);
  
    const { revalidate } = useRevalidator();
  
    useEffect(() => {
      if (data) {
        console.log("[useRouteLiveLoader] Received SSE data:", data);
      }
      revalidate();
      console.log("[useRouteLiveLoader] Revalidation triggered");
      // eslint-disable-next-line react-hooks/exhaustive-deps -- "we know better" — Moishi
    }, [data]);
  
    return useRouteLoaderData<T>(route);
  }