package sample.exercise.resources;

import java.util.ArrayList;
import java.util.List;

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

import sample.exercise.bean.Book;
import sample.exercise.bean.BookList;
import sample.exercise.bean.Result;

@Path("/books")
public class BookResource {
  private static List<Book> list = new ArrayList<Book>();

  static {
    list.add(new Book("The Oath of the Vayuputras: Shiva Trilogy 3", "Amish Tripathi", 1, 909));
    list.add(new Book("Rich Dad Poor Dad", "Robert T. Kiyosaki", 2, 269));
    list.add(new Book("Glimpses Of World History ", "J L Nehru", 3, 503));

  }

  public static List<Book> getList() {
    return list;
  }

  @GET
  @Path("{id}")
  @Produces({ MediaType.APPLICATION_XML })
  public Book getBookDetail(@PathParam("id")
  int id) {
    for (Book b : list) {
      if (b.getIsbn() == id) {
        return b;
      }
    }
    throw new WebApplicationException(Response.Status.NOT_FOUND);
  }

  @GET
  @Produces({ MediaType.APPLICATION_XML })
  public BookList getBooks() {
    List<Book> bookList = new ArrayList<Book>();
    for (Book b : list) {
      bookList.add(b);
    }
    BookList bList = new BookList();
    bList.setNumber(list.size());
    bList.setBookList(bookList);
    return bList;
  }

  @DELETE
  @Path("{id}")
  public void deleteContact(@PathParam("id")
  int id) throws WebApplicationException {
    boolean found = false;
    System.out.println("delete opaeration called with id " + id);
    for (Book b : list) {
      if (b.getIsbn() == id) {
        list.remove(b);
        found = true;
        break;
      }
    }
    if (!found) {
      throw new WebApplicationException(Response.Status.NOT_FOUND);
    }
  }
  
  @PUT
  @Produces ({ MediaType.APPLICATION_XML })
  @Consumes ({ MediaType.APPLICATION_XML })
  public Result updateBook (JAXBElement<Book> input) {
    Book b = input.getValue();
    boolean found = false;
    for (Book bk : list){
      if (bk.getIsbn()== b.getIsbn()){
        bk.setAuthorName(b.getAuthorName());
        bk.setPrice(b.getPrice());
        found = true;
      }
    }
    if (!found){
      list.add(new Book(b.getTitle(), b.getAuthorName(), getNextIsbn(), b.getPrice()));
      return new Result("Book added", "true");
    }
    return new Result("Book updated", "true");
  }
  
  @POST
  @Consumes ({ MediaType.APPLICATION_XML })
  @Produces ({ MediaType.APPLICATION_XML })
  public Result add (JAXBElement<Book> input) {
    Book b = input.getValue();
    
      list.add(new Book(b.getTitle(), b.getAuthorName(), getNextIsbn(), b.getPrice()));
      return new Result("Book added", "true");
  }
  
  
  private int getNextIsbn (){
    Book b = list.get(list.size() - 1);
    return b.getIsbn() + 1;
  }
}
