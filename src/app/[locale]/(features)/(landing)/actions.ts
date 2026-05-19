"use server";

import { db } from "@/src/db";
import { waitlist } from "@/src/db/schema";
import { Resend } from "resend";
import { z } from "zod";

const WaitlistSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: "Debe ingresar un email válido." })
    .min(5, { message: "El email es demasiado corto." })
    .max(255, {
      message: "El email es demasiado largo para nuestra base de datos.",
    }),
});

export async function joinWaitlist(prevState: any, formData: FormData) {
  const email = formData.get("email");
  console.log("🚀 Recibiendo email en el servidor:", email); // Esto lo ves en tu terminal
  const validated = WaitlistSchema.safeParse({ email });

  if (!validated.success) {
    return {
      error:
        validated.error.flatten().fieldErrors.email?.[0] || "Email inválido",
    };
  }
  try {
    const result = await db
      .insert(waitlist)
      .values({ email: validated.data.email });
    console.log("✅ Insertado en DB:", result);

    const resend = new Resend(process.env.RESEND_API_KEY);

    if (validated.success && process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: "onboarding@ymislucas.com",
          to: "codebymaribel@gmail.com",
          subject: "🚀 ¡Nuevo interesado en ymislucas!",
          text: `Nuevo interesado en la lista de espera:\n\nEmail: ${validated.data.email}`,
        });
      } catch (error) {
        console.error("Error al enviar email:", error);
      }
    }
    return { success: true, message: "¡Listo! Ya estás en la lista." };
  } catch (error: any) {
    const pgCode = error.cause?.code || error.code;

    if (pgCode === "23505") {
      return {
        error: "Este email ya está en la lista. ¡Gracias por el aguante!",
      };
    }

    console.error("Error no manejado:", error);
    return {
      error:
        "Algo falló en el servidor. Intentá de nuevo en un ratito, ya vengo a repararlo :)",
    };
  }
}
