export  function generatePageNumbers(currentPage, totalPages) {
    const maxPagesToShow = 7;
    const pages = [];
  
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const halfMax = Math.floor(maxPagesToShow / 2);
      let startPage = Math.max(1, currentPage - halfMax);
      let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
  
      if (currentPage <= halfMax + 1) {
        endPage = maxPagesToShow;
      } else if (currentPage >= totalPages - halfMax) {
        startPage = totalPages - maxPagesToShow + 1;
        endPage = totalPages;
      }
  
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
  
      if (currentPage < totalPages - halfMax) {
        pages.push("...");
      }
    }
  
    return pages;
  }