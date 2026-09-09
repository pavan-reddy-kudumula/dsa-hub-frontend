import QuestionComponent from "@/components/QuestionComponent"

export default async function Question({ params }) {
    const { id } = await params;

    return (
        <QuestionComponent patternId={id} />
    )
}