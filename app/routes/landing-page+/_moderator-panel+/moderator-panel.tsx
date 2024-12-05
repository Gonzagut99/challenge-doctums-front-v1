import { useLoaderData, useNavigate } from "@remix-run/react";
import { UserRoundPlus } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { Button } from "~/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "~/components/ui/select";
import { moderatorService } from "~/services/http/moderator";

export const loader = async () => {
    return moderatorService.getModerator();
};

const orderCourseBy = {
    name: "Ordernar por nombre de curso",
    participantNumber: "Ordenar por número de participantes",
}

function ModeratorPanel() {
    const moderator = useLoaderData<typeof loader>();
    const navigate = useNavigate();
    return (
        <div className="min-h-dvh w-full flex justify-center items-start">
            <article className="max-w-screen-lg w-full  pb-8 pt-24 px-4 flex justify-between items-center">
                <section className="w-full space-y-4">
                    <header>
                        <h2 className="text-2xl font-bold">
                            ¡Bienvenido/a de nuevo, {moderator.name}{" "}
                            {moderator.lastname}!
                        </h2>
                    </header>
                    <div className="p-12 space-y-6 rounded-[36px] border-none shadow-2xl shadow-zinc-900/10 w-full bg-zinc-50">
                        <CardHeader className="p-0 flex-row justify-between">
                            <CardTitle className="w-fit text-lg font-bold">
                                Vista general de grupos
                            </CardTitle>
                            <Button className="w-fit bg-yellowDark text-zinc-900 hover:bg-yellowDark/50 font-bold !mt-0" onClick={()=>navigate('/landing-page/add-group')}>
                                <UserRoundPlus></UserRoundPlus>
                                <span>Agregar nuevo grupo</span>
                            </Button>
                        </CardHeader>
                        <div className="flex space-x-2">
                            <Select>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Seleccione un curso" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Todos</SelectLabel>
                                        {
                                            moderator.courses.map((course) => (
                                                <SelectItem key={course.id} value={course.id}>
                                                    {course.name}
                                                </SelectItem>
                                            ))
                                        }
                                        <SelectItem value="all">
                                            Todos
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <Input placeholder="Buscar" className="max-w-60">
                            </Input>
                            <Select>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Ordenar por" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {
                                            Object.entries(orderCourseBy).map(([key, value]) => (
                                                <SelectItem key={key} value={key}>
                                                    {value}
                                                </SelectItem>
                                            ))
                                        }
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {
                                moderator.courses.map((course) => (
                                    <CourseCard key={course.id} src={course.icon} className="h-36" to={`/landing-page/group/${course.id}`}>
                                        <CardHeader className="w-4/5 p-0">
                                        <CardTitle className="text-base font-bold">
                                            {course.name}
                                        </CardTitle>
                                            <CardDescription className="text-sm ">
                                            Participantes: {course.participants.length}
                                            </CardDescription>
                                        </CardHeader>
                                    </CourseCard>
                                ))
                            }
                        </div>
                    </div>
                </section>
            </article>
        </div>
    );
}

export default ModeratorPanel;

interface CourseCardProps extends React.HTMLAttributes<HTMLDivElement> {
        children: React.ReactNode;
        src:string;
        to: string;
    }
export const CourseCard = ({
    children,
    src,
    to,
    ...rest
}: CourseCardProps)  => {
    const navigate = useNavigate();
  return (
    <Card {...rest} className={
        twMerge("shadow-none bg-celeste/40 relative rounded-3xl p-4", rest.className)
    }
        onClick={() => navigate(to)}
    >
        {
            children
        }
        <img src={
            src
        } alt="icon" className="absolute bottom-2 right-2 w-20 opacity-80"/>
    </Card>
  )
}
