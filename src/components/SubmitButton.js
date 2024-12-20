const SubmitButton = ({name}) => {
    return (
        <button className="px-4 py-2 bg-blue-400 hover:bg-blue-500 first-letter:uppercase rounded-full font-bold lg:text-xl md:text-md">
            {name}
        </button>
    )
};
export default SubmitButton;