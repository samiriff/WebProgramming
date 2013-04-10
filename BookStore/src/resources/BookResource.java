package resources;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.xml.bind.JAXBElement;

import bean.BookBean;
import bean.BookStoreBean;


@Path("/books")
public class BookResource {
	
	private static final String ERROR_MSG = "NO BOOK FOUND";
	private static BookStoreBean bookStoreBean = new BookStoreBean();
	
	static{
		bookStoreBean = new BookStoreBean(BookStoreBean.getPath());
	}
	
	@GET
	@Produces({ MediaType.TEXT_HTML})
	public String getBooks() {
		bookStoreBean = new BookStoreBean(BookStoreBean.getPath());
		return bookStoreBean.toHTMLString();
	}
	
	@GET
	@Path("{name}")
	@Produces({ MediaType.TEXT_HTML })
	public String getBookDetailByName(@PathParam("name")
	String name) {
		BookStoreBean resultBean = bookStoreBean.searchByTitle(name);
		if(!resultBean.isEmpty())
			return resultBean.toHTMLString();			
		return ERROR_MSG;	
	}
	
	@DELETE
	@Path("{isbn}")
	@Produces({ MediaType.TEXT_HTML })
	public void deleteBook(@PathParam("isbn")
	String isbn) throws WebApplicationException {
		bookStoreBean.deleteBook(BookStoreBean.getPath(), isbn);
	}
	
	@POST
	@Produces ({ MediaType.TEXT_PLAIN })
	@Consumes ({ MediaType.TEXT_PLAIN })
	public String addBook (String input) {
		if(input.trim().equals(""))
			return null;
		String[] tokens = input.split(";");
		String bookTitle = tokens[0];
		String isbn = tokens[1];
		String author = tokens[2];
		int price = Integer.parseInt(tokens[3]);
		String imgSrc = tokens[4];
		boolean isBestBook = Boolean.parseBoolean(tokens[5]);
		String publishedDate = tokens[6];
		bookStoreBean.insertBook(BookStoreBean.getPath(), new BookBean(bookTitle, isbn, author, price, imgSrc, isBestBook, publishedDate));
		
		return "Book added";
	}	
}
