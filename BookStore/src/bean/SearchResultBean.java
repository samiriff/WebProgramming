package bean;

import java.util.Iterator;
import java.util.LinkedHashMap;

/**
 * Used to store search results
 * @author ssheriff
 *
 */
public class SearchResultBean {
	private LinkedHashMap<String, BookBean> bookList = new LinkedHashMap<String, BookBean>();

	public LinkedHashMap<String, BookBean> getBookList() {
		return bookList;
	}

	public void setBookList(LinkedHashMap<String, BookBean> bookList) {
		this.bookList = bookList;
	}
	
	public void addBookBean(BookBean bookBean){
		bookList.put(bookBean.getIsbn(), bookBean);		
	}
	
	public boolean isEmpty(){
		return bookList.isEmpty();
	}

	public String toHTMLString() {
		String str = "<br/><br/><div style=\"padding-left:25%; padding-right: 20%;\"><table border=\"4\">";
		str += "<tr>" +
				"<th>Title</th>" +
				"<th>ISBN</th>" +
				"<th>Author</th>" +
				"<th>Price</th>" +
				"<th>Image Source</th>" +
				"<th>Is Best Book</th>" +
				"<th>Date Published</th>" +
				"<th>Stock</th>" +
				"</tr>";
		Iterator<String> iter = bookList.keySet().iterator();
		while(iter.hasNext()){
			str += "<tr>" + bookList.get(iter.next()).toHTMLString() + "</tr>";
		}
		str += "</div>";
		return str;
	}
}
