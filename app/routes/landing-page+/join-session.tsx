import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@remix-run/react";
import { RemixFormProvider, useRemixForm } from "remix-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";

const schema = z.object({
    code: z.string().min(32).max(32),
});
type FormData = z.infer<typeof schema>;
const resolver = zodResolver(schema);
export default function SignUp() {
    const form = useRemixForm<FormData>({
        resolver,
    });
  return (
    <div className="min-h-dvh p-4 flex items-center justify-center">
        <Card className="min-w-[480px] max-w-[480px] w-fit p-12 space-y-6 rounded-[36px] border-none shadow-2xl shadow-zinc-900/10">
            <CardHeader className="p-0">
                <CardTitle className="text-3xl font-medium leading-snug">Estas a un paso de comenzar tu experiencia</CardTitle>
                <CardDescription className="text-md">Agrega aquí el código que te ha brindado tu asesor educativo</CardDescription>
            </CardHeader>
            <RemixFormProvider {...form}>
                <Form onSubmit={form.handleSubmit} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="code"
                        render={
                            ({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">
                                        Código
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field}  placeholder="Ingresa tu código" className="placeholder:opacity-50"/>
                                    </FormControl>
                                    {/* <FormDescription></FormDescription> */}
                                    <FormMessage></FormMessage>
                                </FormItem>
                            )
                        }
                    >

                    </FormField>
                        <Button className="w-full bg-yellowDark text-zinc-900 hover:bg-yellowDark/50 font-bold text-lg !mt-6" type="submit">
                            Ingresar
                        </Button>
                </Form>
            </RemixFormProvider>
        </Card>
    </div>
  )
}