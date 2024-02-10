
const Loading = () => {
    const svgStyle = {
        stroke: '#243c5a',
    };
    return (
        <div className="flex items-center justify-center mx-auto">
            <button type="button" className="border-2 rounded-xl flex p-3 items-center" disabled>
                {/* <svg className="animate-spin h-5 w-5 mr-3 stroke-2 stroke-cyan-500" viewBox="0 0 24 24">
                    <path fill="none" strokeWidth="2" strokeLinecap="round" cx="12" cy="12" r="10" />
                </svg> */}

                <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48px" height="48px">
                    <path d="M 12 0 L 8 4 L 12 8 L 12 5 C 15.859 5 19 8.14 19 12 C 19 12.88 18.82925 13.720094 18.53125 14.496094 L 20.046875 16.009766 C 20.651875 14.800766 21 13.442 21 12 C 21 7.038 16.963 3 12 3 L 12 0 z M 3.953125 7.9902344 C 3.348125 9.1992344 3 10.558 3 12 C 3 16.962 7.037 21 12 21 L 12 24 L 16 20 L 12 16 L 12 19 C 8.141 19 5 15.86 5 12 C 5 11.12 5.17075 10.279906 5.46875 9.5039062 L 3.953125 7.9902344 z" />
                </svg>
                Processing...
            </button>
        </div>
    )
}

export default Loading