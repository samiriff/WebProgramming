package bean;

import java.util.ArrayList;
import java.util.List;

/**
 * Contains details about a collection of books
 * @author ssheriff
 *
 */
public class BookStoreBean {
	private List<BookBean> bookList;
	
	public BookStoreBean(){
		bookList = new ArrayList<BookBean>();
	}

	public List<BookBean> getBookList() {
		return bookList;
	}

	public void setBookList(List<BookBean> bookBeans) {
		this.bookList = bookBeans;
	}
	
	public void addBookBean(BookBean bookBean){
		bookList.add(bookBean);
	}
}
