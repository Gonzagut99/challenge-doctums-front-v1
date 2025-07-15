import { Outlet } from "@remix-run/react";
import { PageContainer } from "~/components/custom/PageContainer";

export default function Game() {
    return (
        <PageContainer>
            <Outlet />
        </PageContainer>
    );
}
