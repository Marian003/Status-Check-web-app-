import Link from "next/link";

import { LoginForm } from "@/components/auth/LoginForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-lg">Вхід до Status Check</CardTitle>
        <CardDescription>
          Увійдіть, щоб переглядати спільний календар комітментів.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <LoginForm />
        <p className="text-sm text-muted-foreground">
          Немає акаунту?{" "}
          <Link
            href="/register"
            className="font-medium text-foreground underline underline-offset-4"
          >
            Зареєструватися
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
