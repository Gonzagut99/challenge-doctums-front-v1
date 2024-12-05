import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Dices } from "lucide-react";
import { Button } from "~/components/ui/button";
import { CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { moderatorService } from "~/services/http/moderator";


export const loader = async ({ params }: LoaderFunctionArgs) => {
    const courses = (await moderatorService.getModerator()).courses;
    const courseId = params.courseId;
    const course = courses.find((course) => course.id === courseId);
    return course;
};

export default function CourseDetail() {
    const course = useLoaderData <typeof loader>();
    return (
        <div className="min-h-dvh w-full flex justify-center items-start">
            <article className="max-w-screen-lg w-full  pb-8 pt-24 px-4 flex justify-between items-center">
                <section className="w-full space-y-4">
                    <header className="flex justify-between">
                        <h2 className="text-2xl font-bold">
                            {course.name}
                        </h2>
                        <Button
                                className="w-fit bg-yellowDark text-zinc-900 hover:bg-yellowDark/50 font-bold !mt-0"
                                
                            >
                                <Dices></Dices>
                                <span>Crear partida</span>
                            </Button>
                    </header>
                    <div className="p-6 space-y-6 rounded-[36px] border-none shadow-2xl shadow-zinc-900/10 w-full bg-zinc-50">
                        <CardHeader className="p-0 flex-row justify-between">
                            <CardTitle className="w-fit text-lg font-bold">
                                Participantes
                            </CardTitle>
                            <div className="flex gap-1">
                                <Input placeholder="Buscar">
                                </Input>
                                <Button>
                                    Enviar
                                </Button>
                            </div>
                        </CardHeader>
                    </div>
                </section>
            </article>
        </div>
    );
}
