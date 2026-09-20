import PatternQuestionsComponent from "@/components/PatternQuestionsComponent"
import NavbarComponent from "@/components/NavbarComponent";

export default async function PatternDetails({ params }) {
    const { patternId } = await params;

    return (
        <>
            <NavbarComponent />
            <PatternQuestionsComponent patternId={patternId} />
        </>
    )
}