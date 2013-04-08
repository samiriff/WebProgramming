package servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.logging.Logger;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import bean.BookBean;
import bean.BookStoreBean;

import model.BookStore;
import model.Constants;


/**
 * Servlet implementation class MainController
 */
@WebServlet(description = "Controller Servlet", urlPatterns = { "/MainController" })
public class MainController extends HttpServlet implements Constants {
	private static final long serialVersionUID = 1L;
	private static final String PATH_PREFIX = "/jsp/";
	private Logger log = Logger.getLogger(MainController.class.getName());
       
    /**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {		
		
		//Maintaining only one bean per session (based on the assumption that bookStore.xml is never updated)
		BookStoreBean bookStoreBean = (BookStoreBean) request.getSession().getAttribute("bookStoreBean");
		BookStore bookStore;
		if(bookStoreBean == null){			
			bookStore = new BookStore(request.getServletContext().getRealPath("/") + "DataSource/bookStore.xml");
			request.getSession().setAttribute("bookStoreBean", bookStore.getBookStoreBean());
		}
		else{
			bookStore = new BookStore(bookStoreBean);
		}
		
		log.info(bookStore.getBookStoreBean().toString());
		log.info(request.getParameter("searchKey"));
		
		resolveTask(TaskType.valueOf(request.getParameter("taskType")), bookStore, request, response);		 
				
	}

	/**
	 * Performs the required task and forwards results to other jsp pages
	 * @param taskType
	 * @param bookStore
	 * @param request
	 * @param response
	 * @throws ServletException
	 * @throws IOException
	 */
	private void resolveTask(TaskType taskType, BookStore bookStore, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
		String address = "";		
		switch(taskType){
		
			case DISPLAY_ALL_BOOKS: 
				address = PATH_PREFIX + "Home Page.jsp";
				break;
				
			case SEARCH: 
				BookStoreBean searchResults = bookStore.searchByTitle(request.getParameter("searchKey"));				
				request.setAttribute("searchResultBean", searchResults);
				address = PATH_PREFIX + "Search Page.jsp";
				break;
				
			case SHOPPING_CART:
				BookBean resultBean = bookStore.searchByISBN(request.getParameter("isbn"));			
				log.info("Search ISBN = " + request.getParameter("isbn"));
				log.info("Result bean = " + resultBean.getBookTitle());
				request.setAttribute("resultBean", resultBean);
				address = PATH_PREFIX + "Details Page.jsp";
				break;
				
			case ADD_TO_CART:
				BookBean bookBought = bookStore.addToCart(request.getParameter("isbn"));
				request.setAttribute("bookBought", bookBought);
				log.info("" + bookBought.getStock());
				PrintWriter out = response.getWriter();
				if(bookBought.getStock() > 0)
					out.println("In Stock = " + bookBought.getStock());
				else
					out.println("Out of Stock");
				break;
				
			case REST_API:
				log.info("REST API");
				response.sendRedirect("book/books");				
				break;
				
			case ADD_NEW_BOOK:
				log.info("ADDING NEW BOOK");
				bookStore.insertBook(request.getServletContext().getRealPath("/") + "DataSource/bookStore.xml", 
									new BookBean(request.getParameter("name"), 
										request.getParameter("isbn"), 
										request.getParameter("author"), 
										Integer.parseInt(request.getParameter("price")), 
										request.getParameter("imgSrc"), 
										Boolean.parseBoolean(request.getParameter("isBestBook")), 
										request.getParameter("publishedDate")));				
				
				break;
		}		
		if(!address.isEmpty()){
			RequestDispatcher dispatcher = request.getRequestDispatcher(address);
			dispatcher.forward(request, response);
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
