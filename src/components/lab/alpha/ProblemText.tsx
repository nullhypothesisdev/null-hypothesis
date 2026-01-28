export default function ProblemText({ children, ...props }: any) {
    return (
        <p className="font-serif text-lg text-ink/80 italic border-l-2 border-accent pl-4 my-4" {...props}>
            {children}
        </p>
    );
}
