import {
    useLoaderData,
    useResolvedPath,
    useRevalidator,
    useRouteLoaderData,
  } from "@remix-run/react";
  import { useEffect } from "react";
  import { useEventSource } from "remix-utils/sse/react";
  
  export function useLiveLoader<T>() {
    const path = useResolvedPath("./stream");
    const data = useEventSource(path.pathname);
  
    const { revalidate } = useRevalidator();
  
    useEffect(() => {
      revalidate();
      // eslint-disable-next-line react-hooks/exhaustive-deps -- "we know better" — Moishi
    }, [data]);
  
    return useLoaderData<T>();
  }

  export function useRouteLiveLoader<T>(route:string) {
    const path = useResolvedPath("./stream");
    const data = useEventSource(path.pathname);
  
    const { revalidate } = useRevalidator();
  
    useEffect(() => {
      revalidate();
      // eslint-disable-next-line react-hooks/exhaustive-deps -- "we know better" — Moishi
    }, [data]);
  
    return useRouteLoaderData<T>(route);
  }