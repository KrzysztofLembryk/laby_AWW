from bs4 import BeautifulSoup
import requests as req
import googlesearch as g_search
import os
import time
import pandas as pd
import datetime

# Dobra stronka do regexow: https://regex101.com/
# warto ogarnac: https://stackoverflow.com/questions/2301285/what-do-lazy-and-greedy-mean-in-the-context-of-regular-expressions

URL = 'https://www.tiobe.com/tiobe-index/'


def get_html_page(url: str):
    while True:
        try:
            page = req.get(url)
            return page
        except req.exceptions.ConnectionError:
            print("Connection refused :(")
            time.sleep(1)


def make_soup_obj(page):
    soup = BeautifulSoup(page.content, "html.parser")
    return soup


def init_markdown(name: str, draft: str, layout: str):
    markdown = "---\n"
    markdown += "title: " + name + "\n"
    markdown += "draft: " + draft + "\n"
    markdown += "layout: " + layout + "\n"
    markdown += "---\n"

    return markdown


def make_front_page_to_markdown(save_path: str, ref_path: str, name_and_month: str,
                                intro: str):
    markdown = init_markdown(name="INTRO", draft="false", layout="home")

    markdown += f"\nHere is a site about {name_and_month}\n\n"
    markdown += f"**Quick intro**: {intro}\n"
    markdown += "[MoreInfo]({% link " + ref_path + " %})\n"
    markdown += "![Alt text](https://www.creativefabrica.com/wp-content/uploads/2022/09/" \
                "20/Pink-lama-Cute-baby-girl-alpaca-charact-Graphics-38925359-1-1-580x387.png)"

    with open(save_path, 'w') as md:
        md.write(markdown)


def make_df_to_markdown(save_path: str, ref_path: str, df: pd.DataFrame):
    markdown = init_markdown(name="Scrapped DATA", draft="false", layout="page")
    markdown += "# LIST OF PROGRAMMING LANGUAGES\n"
    # col: [Feb 2024, Feb 2023, Programming Language, Ratings, Change, Image_URL
    for index, row in df.iterrows():
        markdown += "## " + row["Programming Language"] + "\n"
        markdown += "![Alt text](" + row["Image_URL"] + " '" + \
                    row["Programming Language"] + "')\n\n"
        markdown += f"Place in {df.columns[0]} is: {row[df.columns[0]]}<br />"
        markdown += f"in {df.columns[1]} was: {row[df.columns[1]]}<br />"
        markdown += f"RATING: {row['Ratings']}<br />"
        markdown += f"CHANGE: {row['Change']}<br />"
        markdown += "[more info]({% link " + ref_path + \
                    row["Programming Language"].replace(" ", "_").replace("/",
                                                                          "_") + '.md %})\n'

    with open(save_path, 'w') as md:
        md.write(markdown)


def get_language_names(df: pd.DataFrame):
    name_lst = list()
    for index, row in df.iterrows():
        name_lst.append(row["Programming Language"].replace(" ", "_").replace("/", "_"))

    return name_lst


def get_first_paragraph_from_page(url):
    print("url: ", url)
    page = get_html_page(url=url)
    soup = make_soup_obj(page)
    paragraphs = soup.find_all("p")
    res_paragraph = ""
    i = 0

    # Bierzemy kilka pierwszych paragrafow
    for p in paragraphs:
        if len(p.text) > 1:
            res_paragraph += f"" + p.text + "\n"
            i += 1
        if i == 2:
            break
    # return paragraph.text
    return res_paragraph


def google_search_more_info(lst_of_names, save_path: str):
    for name in lst_of_names:
        print("Searching info for: ", name)
        markdown = init_markdown(name=name, draft="false", layout="page")
        if name == "Go":
            res = g_search.search("wikipedia " + name + " language")
        else:
            res = g_search.search("wikipedia " + name)
        wiki_url = ""

        for result in res:
            wiki_url = result
            break

        paragraph = get_first_paragraph_from_page(wiki_url)
        markdown += (paragraph + "\n")
        markdown += f"**MORE INFO AT:** [LINK]({wiki_url})\n"

        with open(save_path + name + ".md", 'w', encoding="utf-8") as md:
            md.write(markdown)


def find_col_names(soup_table):
    cols = soup_table.find_all("th")
    res_lst = list()
    first = True
    for name in cols:
        # nie chcemy pierwszego change bo tam albo nic nie ma albo sa strzalki img
        if name.text == "Change" and first:
            first = False
        else:
            res_lst.append(name.text)
    return res_lst


def make_df_from_soup_table(soup_table, col_names):
    col_names.append("Image_URL")
    df = pd.DataFrame(columns=col_names)

    for row in soup_table.find_all('tr'):
        # Find all data for each column
        columns = row.find_all('td')

        if columns:
            images = row.find_all("img")
            for image in images:
                if "tiobe-index" in image.get("src"):
                    image_url = "https://www.tiobe.com"
                    image_url += image.get("src")
                    break

            val_lst = list()
            for i in range(len(columns)):
                # nie bierzemy 2 i 3 bo to sa jakies puste rzeczy (czyli ta pierwsza
                # kolumna change)
                if i != 2 and i != 3:
                    val_lst.append(columns[i].text)

            val_lst.append(image_url)
            df.loc[len(df.index)] = val_lst

    print("res DataFrame: ")
    print(df.head())
    return df


def main():
    page = get_html_page(url=URL)
    soup = make_soup_obj(page)

    h1_month = soup.find("h1")
    intro = "The TIOBE Programming Community index is an indicator of the popularity of " \
            "programming languages. The index is updated once a month. " \
            "The ratings are based on the number of skilled engineers world-wide, " \
            "courses and third party vendors."

    # dajemy find bo wiemy ze tylko jedna jest taka tabela, a nawet jesli dwie to
    # chcemy pierwsza z nich
    soup_table = soup.find("table", class_="table table-striped table-top20")

    col_names = find_col_names(soup_table=soup_table)
    df = make_df_from_soup_table(soup_table, col_names)
    name_lst = get_language_names(df)

    save_path_front = 'my_prog_lang_site/index.md'
    ref_path_front = 'lang_lst.md'

    save_path_df = 'my_prog_lang_site/lang_lst.md'
    ref_path_df = 'my_pages/'

    save_path_google_search = os.getcwd() + "\\my_prog_lang_site\\my_pages\\"

    make_front_page_to_markdown(save_path=save_path_front,
                                ref_path=ref_path_front,
                                name_and_month=h1_month.text, intro=intro)
    make_df_to_markdown(save_path=save_path_df,
                        ref_path=ref_path_df, df=df)
    google_search_more_info(name_lst, save_path_google_search)


main()
