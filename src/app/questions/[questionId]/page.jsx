import QuestionDetailsComponent from "@/components/questions/QuestionDetailsComponent";

export default async function QuestionDetails({params}) {
    const { questionId } = await params;

    return (
        <QuestionDetailsComponent questionId={questionId}/>
    )
}