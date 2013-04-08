package model;

import java.io.File;
import java.util.List;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import bean.BookBean;
import bean.BookStoreBean;

/**
 * Represents the entire book store
 * @author ssheriff
 *
 */
public class BookStore {
	
	BookStoreBean bookStoreBean;
	
	public BookStore(String path){
		bookStoreBean = new BookStoreBean();
		populateBookStore(path, bookStoreBean);		
	}
	
	public BookStore(BookStoreBean bookStoreBean){
		this.bookStoreBean = bookStoreBean;
	}
	
	public BookStoreBean getBookStoreBean(){		
		return bookStoreBean;
	}
	
	public BookStoreBean searchByTitle(String title){
		if(title.trim().equals(""))
			return null;
		List<BookBean> bookList = bookStoreBean.getBookList();
		title = title.toLowerCase();
		BookStoreBean searchResults = new BookStoreBean();
		for(BookBean bookBean : bookList){
			if(bookBean.getBookTitle().toLowerCase().indexOf(title) != -1)
				searchResults.addBookBean(bookBean);
		}
		return searchResults;
	}

	public BookBean searchByISBN(String isbn) {		
		List<BookBean> bookList = bookStoreBean.getBookList();	
		for(BookBean bookBean : bookList){
			if(bookBean.getIsbn().indexOf(isbn) != -1)
				return bookBean;
		}
		return null;
	}
	
	/**
	 * Adds the book (with the given isbn), if available, to the current user's shopping cart, and reduces the stock of the book by one.
	 * @param isbn
	 * @return
	 */
	public BookBean addToCart(String isbn){
		BookBean bookBean = searchByISBN(isbn);
		bookBean.addToCart();
		return bookBean;
	}

	/**
	 * Populates the bookstorebean with data from an XML file
	 * @param path
	 * @param bookStoreBean
	 */
	private void populateBookStore(String path, BookStoreBean bookStoreBean) {
		try{		
			File fXMLFile = new File(path);
			DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
			DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
			Document doc = dBuilder.parse(fXMLFile);		
			doc.getDocumentElement().normalize();	
			
			NodeList nList = doc.getElementsByTagName("book");			
			
			for (int temp = 0; temp < nList.getLength(); temp++) {
				 
				Node nNode = nList.item(temp);			
		 
				if (nNode.getNodeType() == Node.ELEMENT_NODE) {
		 
					Element eElement = (Element) nNode;
		 
					String bookName = eElement.getElementsByTagName("name").item(0).getTextContent();
					String isbn = eElement.getElementsByTagName("isbn").item(0).getTextContent();
					String author = eElement.getElementsByTagName("author").item(0).getTextContent();
					int price = Integer.parseInt(eElement.getElementsByTagName("price").item(0).getTextContent());
					String imgSrc = eElement.getElementsByTagName("imgSrc").item(0).getTextContent();
					boolean isBestBook = Boolean.parseBoolean(eElement.getElementsByTagName("isBestBook").item(0).getTextContent());
					String publishedDate = eElement.getElementsByTagName("publishedDate").item(0).getTextContent();
					
					
					bookStoreBean.addBookBean(new BookBean(bookName, isbn, author, price, imgSrc, isBestBook, publishedDate));				
				}
			}
			
			
			
		}catch (Exception e) {
			e.printStackTrace();
	    }
	}
}
