// Override sizzle attribute retrieval
Sizzle.attr = eQuery.attr;
eQuery.find = Sizzle;
eQuery.expr = Sizzle.selectors;
eQuery.expr[":"] = eQuery.expr.pseudos;
eQuery.unique = Sizzle.uniqueSort;
eQuery.text = Sizzle.getText;
eQuery.isXMLDoc = Sizzle.isXML;
eQuery.contains = Sizzle.contains;
