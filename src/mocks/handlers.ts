import { http, HttpResponse } from "msw";

export const handlers = [
  http.post("/api/login", async ({ request }) => {
    const body = await request.json();
    const { email, password } = body as {email:string, password: string};

    // Симуляция успешного логина
    if (email === "test@email.com" && password === "password123") {
      return HttpResponse.json(
        { success: true, message: "Correct credentials", token: "fake-token" },
        { status: 200 }
      );
    }

    // Вариации ошибок
    if (email === "wrong@email.com") {
      return HttpResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }
    if (email === "server-error@email.com") {
      return HttpResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
    if (email === "network-error@email.com") {
      return HttpResponse.error();
    }

    return HttpResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }),

  http.post("/api/verify-2fa", async ({ request }) => {
    const body = await request.json();
    const { code } = body as {code: string};

    // Симуляция успешной верификации
    if (code === "123456") {
      return HttpResponse.json(
        { success: true, message: "2FA verified" },
        { status: 200 }
      );
    }

    // Вариации ошибок
    if (code === "wrongcode") {
      return HttpResponse.json({ error: "Invalid 2FA code" }, { status: 401 });
    }
    if (code === "expired") {
      return HttpResponse.json({ error: "Code expired" }, { status: 403 });
    }
    if (code === "servererror") {
      return HttpResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
    if (code === "networkerror") {
      return HttpResponse.error();
    }

    return HttpResponse.json({ error: "Invalid 2FA code" }, { status: 401 });
  }),
];
