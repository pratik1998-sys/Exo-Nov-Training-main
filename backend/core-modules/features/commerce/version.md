 Commerce Version 1.0.001

V1.0.001
- Renamed GraphQL operations and Controller methods to follow a new best practice standard, where the method names are in the format:
  {featureId}{verb}. Example: "addCartItems" GraphQL operation is now "cartItemsAdd", and it's sibling Controller method "addCartItems" is
  also "cartItemsAdd".
- Added common API options framework to define options in a single class, shared across controller and resolver