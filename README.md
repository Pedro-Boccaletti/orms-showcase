# 🧰 ORM Showcase Repository

This repository demonstrates how to implement the same **Blog API** using different Object-Relational Mappers (ORMs) and query builders. The goal is to provide a side-by-side comparison of developer experience, patterns, and performance.

---

## 📚 Purpose

- Explore and compare ORM libraries
- Provide minimal, consistent API implementations across different stacks
- Serve as a reference for developers choosing between ORMs

---

## 🔗 Implementations

| ORM / Tool | Folder                  |
| ---------- | ----------------------- |
| TypeORM    | [`/typeorm`](./typeorm) |
| Prisma     | [`/prisma`](./prisma)   |
| Drizzle    | [`/drizzle`](./drizzle) |

> Each folder contains a self-contained project with its own README and setup instructions.

---

## 📘 OpenAPI Specification

You can view the full OpenAPI spec here:

## 👉 [`openapi.yaml`](./openapi.yaml)

## 🧪 Testing

- [ ] Consistent test cases across all implementations (WIP)
- [ ] Shared test scripts or Postman collection (planned)

---

## 📝 Contributing

Pull requests with new ORMs or improvements to existing ones are welcome! Please ensure:

- Folder names are lowercase and match the ORM
- API structure follows the pattern described above
- A `README.md` is included in each subproject with setup and usage instructions

---

## 📄 License

MIT License.
