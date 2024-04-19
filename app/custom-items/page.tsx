"use client";
import { PageProvider } from "../../contexts/PageContext";
import NavBar from "../../components/NavBar";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import CustomItemsPageBody from "./CustomItemsPageBody";


export default function Page() {
    const searchParams = useSearchParams();

    return (
        <>
            <PageProvider>
                <NavBar />
                <CustomItemsPageBody />
            </PageProvider>
        </>
    );
}
