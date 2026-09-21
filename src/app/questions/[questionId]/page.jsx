import QuestionComponent from "@/components/QuestionComponent";

export default async function QuestionDetails({params}) {
    const { questionId } = await params;

    return (
        <QuestionComponent questionId={questionId}/>
    )
}