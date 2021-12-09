import Head from "next/head";
import Link from "next/link";
// react feathr icons
import { Heart } from "react-feather";
import styles from "../styles/Home.module.sass";
import { ToDoLists } from "../features/todo/ToDoLists";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>ToDo App</title>
        <meta name="description" content="A simple todo app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <nav>ToDos</nav>
      </header>

      <main className={styles.main}>
        <ToDoLists />
      </main>

      <footer className={styles.footer}>
        <p>
          Developed with <Heart /> <span>By</span>
          <Link
            href="https://www.linkedin.com/in/muhammed-ahad-ba625986/"
            passHref
          >
            <a target="_blank">Muhammed Ahad</a>
          </Link>
        </p>
      </footer>
    </div>
  );
}
