---
title: Working with the ASP.NET ListView and row and column clicks
description: The ListView control is a worthly alternative to the GridView control. This article shows how to use the ListView control in your AVR for .NET Framework ASP.NET apps.
tags:
  - asp-net
  - visual-rpg
date_published: '2024-01-11T11:57:34.000Z'
date_updated: '2024-01-11T20:18:15.000Z'
date_created: '2024-01-11T20:18:15.000Z'
pinned: false
---

[See code on GitHub](https://github.com/ASNA/listview-row-col-clicked)

The [ListView](https://msdn.microsoft.com/en-us/library/bb398790.aspx) is a worthy alternative to the [GridView](https://msdn.microsoft.com/en-us/library/2s019wc0.aspx) control. With the ListView control, you are 100% in charge of the markup produced. This makes the ListView much better suited to pages where you need complete control over the markup, such as when you’re using a CSS framwork like BootStrap.

However, the ListView’s model for determining row clicks is quite different from the GridView. This article shows how to determine what row and column got clicked with the ListView.

#### The ListView’s OnItemCommand property

The OnItemCommand binds an event handler subroutine to the ListView’s OnItemCommand event. Unlike a GridView, the ListView’s internal controls (those defined in the ItemTemplate section) _do not_ fire their own intrinsic events. Instead, these controls events (which are usually click events) are channeled through the handler registered with the OnItemCommand. The OnItemCommand handler must include the two parameters shown below

```
BegSr listviewCustomersRowAction Access(*Protected) 
    DclSrParm sender Type(*Object)
    DclSrParm e Type(ListViewCommandEventArgs)

    DclFld CommandName Type(*String) 
    DclFld RowNumber Type(*Integer4)

    CommandName = e.CommandName
    RowNumber = Convert.ToInt32(e.CommandArgument)

    // Do something here based on CommandName and RowNumber 
EndSr
```  
Figure 1. An example OnItemCommand handler  

> There may be other ways to assign ListView’s OnItemCommand handler, but assigning the handler with the declarative OnItemCommand property is the technique that’s always worked for me.

#### Identifying button and row clicked using CommandName and CommandArgument properties

All buttons (or other controls with "click" events) should specify a CommandArgument and CommandName in the markup. These two values are available in the OnItemCommand handler through its ListViewCommandEventArgs parameter. The CommandName easily indicates what control got clicked. It would be nice if there was an intrinsic way to determine what row got clicked–but there isn’t. However, the ordinal row number position is available through the `Container.DisplayIndex` property. Assign it as shown below in Figure 2:

```
    CommandArgument="<%# Container.DisplayIndex %>"
```    
  
Figure 2. Assigning the ordinal row number to the CommandArgument property.  

The ListView has seven special-case command names:

*   Cancel
*   Delete
*   Select
*   Edit
*   Insert
*   Update
*   Sort

[ASP.NET prescribes specific behaviors](https://msdn.microsoft.com/en-us/library/system.web.ui.webcontrols.listview.itemcommand%28v=vs.110%29.aspx) for these seven command names. Any other command name is considered a custom command. I rarely use the built-in behaviors for the special-case command names and generally use custom command names. Don’t use any of the seven special-case command names for custom commands (ie, use "updaterow" instead of "Update" for a custom update command).

#### Example ListView markup

Example ListView markup is shown below in Figure 3. Using this markup along with the OnItemHandler shown in Figure 1 makes is easy to determine what button and row got clicked in a ListView control.
            
```
<asp:ListView ID="listviewCustomers" runat="server" OnItemCommand="listviewCustomersRowAction">
    <LayoutTemplate>
        <div class="row">
            <div class="col-sm heading">
                Name
            </div>
            <div class="col-md heading">
                City, State, Zip
            </div>
            <div class="col-sm heading">
                Actions
            </div>
        </div>        
        <asp:PlaceHolder runat="server" ID="itemPlaceholder" />
    </LayoutTemplate>

    <ItemTemplate>
        <div class="row">
            <div class="col-sm">
                <%# (Container.DataItem *As Customer).FirstName.Trim() ++ 
                    " " ++ 
                    (Container.DataItem *As Customer).LastName.Trim() %>
            </div>
            <div class="col-md">
                <%# (Container.DataItem *As Customer).City.Trim() ++ 
                    " " ++ 
                    (Container.DataItem *As Customer).State.Trim() ++ 
                    " " ++ 
                    (Container.DataItem *As Customer).ZipCode.ToString("00000") %>
            </div>
            <div class="col-sm">
                <asp:LinkButton ID="linkbuttonUpdate" class="btn btn-primary btn-tiny" runat="server" 
                     CommandArgument="<%# Container.DisplayIndex %>" CommandName="updaterow">Update</asp:LinkButton>
                <asp:LinkButton ID="linkbuttonEmail" class="btn btn-primary btn-tiny" runat="server" 
                     CommandArgument="<%# Container.DisplayIndex %>" CommandName="sendemail">Email</asp:LinkButton>
            </div>                    
        </div>
    </ItemTemplate>
</asp:ListView>        
``` 

Figure 3a. Example ListView markup  

![Example ListView control at runtime](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/listview-row-clicked.png)
  
Figure 3b. The ListView output generated from the markup in Figure 3a

