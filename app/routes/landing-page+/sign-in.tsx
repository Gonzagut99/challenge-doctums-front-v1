// import type { ActionFunctionArgs } from "@remix-run/node";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, Link, redirect } from "@remix-run/react";
import { RemixFormProvider, useRemixForm } from "remix-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "~/components/ui/card";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});
type FormData = z.infer<typeof schema>;
const resolver = zodResolver(schema);


export const action = async () => {
  return redirect("/landing-page/moderator-panel");
};

export default function SignUp() {
    const form = useRemixForm<FormData>({
        resolver,
    });
    return (
        <div className="min-h-dvh p-4 flex items-center justify-center">
            <Card className="min-w-[480px] max-w-[480px] w-fit p-12 space-y-6 rounded-[36px] border-none shadow-2xl shadow-zinc-900/10">
                <CardHeader className="p-0">
                    <CardTitle className="text-3xl font-medium leading-snug">
                        Bienvenido de nuevo
                    </CardTitle>
                    <CardDescription className="text-xl">
                        Inicia sesión
                    </CardDescription>
                </CardHeader>
                <RemixFormProvider {...form}>
                    <Form onSubmit={form.handleSubmit} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">
                                        Correo electrónico{" "}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Ingresa tu correo"
                                            className="placeholder:opacity-50"
                                        />
                                    </FormControl>
                                    {/* <FormDescription></FormDescription> */}
                                    <FormMessage></FormMessage>
                                </FormItem>
                            )}
                        ></FormField>
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">
                                        Contraseña
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="password"
                                            placeholder="Ingresa tu contraseña"
                                            className="placeholder:opacity-50"
                                        />
                                    </FormControl>
                                    {/* <FormDescription></FormDescription> */}
                                    <FormMessage></FormMessage>
                                </FormItem>
                            )}
                        ></FormField>
                        <Separator
                            className="my-4"
                            orientation="horizontal"
                        ></Separator>
                        <div className="space-x-1 flex w-full justify-center">
                            <span>¿No tienes cuenta? </span>
                            <Link
                                className="text-blue-500"
                                to={"/landing-page/sign-up"}
                            >
                                Regístrate
                            </Link>
                        </div>
                        <Button
                            className="w-full bg-yellowDark text-zinc-900 hover:bg-yellowDark/50 font-bold text-lg !mt-6"
                            type="submit"
                        >
                            Ingresar
                        </Button>
                    </Form>
                </RemixFormProvider>
            </Card>
        </div>
    );
}
