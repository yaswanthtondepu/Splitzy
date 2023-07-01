import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function Home() {
    return (
        <Link href="http://localhost:3001">
            <Button>Login to splitwise </Button>
        </Link>
    );
}
