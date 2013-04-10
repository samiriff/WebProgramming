package model;

public interface Constants
{
	public static final String XML_FILE_NAME = "DataSource/bookStore.xml";
	
	//List of all possible tasks
	enum TaskType
	{
		DISPLAY_ALL_BOOKS,
		SEARCH,
		SHOPPING_CART,
		ADD_TO_CART, 
		REST_API,
		ADD_NEW_BOOK,
		DELETE_BOOK
	}
}
