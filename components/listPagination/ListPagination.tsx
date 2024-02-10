import { generatePageNumbers } from "@/lib/generatePageNumbers";
import React from "react"


const ListPagination = (
    { totalPages, currentPage, setCurrentPage }:
        { totalPages: number, currentPage: number, setCurrentPage: number }
) => {

    const generatedPages = generatePageNumbers(currentPage, totalPages);
    return (
        <section className="flex items-center justify-end my-2 mr-2 p-2 gap-1">
            {generatedPages.map((numberPage, index) => (
                <React.Fragment key={numberPage}>
                    <span className={`border-2 p-2 cursor-pointer border-slate-400 rounded-md ${numberPage === currentPage && 'text-green-500 font-semibold'}`}
                        onClick={() => setCurrentPage(numberPage)}
                    >
                        {numberPage}
                    </span>

                </React.Fragment >

            ))}
        </section>
    )
}

export default ListPagination