from nltk import download
from .assets import TICKERS
import pandas as pd
#download('vader_lexicon')
#download('stopwords')
#download('punkt')

import os

path = os.path.dirname(os.path.abspath((__file__)))


def get_sentiment_data(ticker, itemtype):
    
    df = pd.read_csv(f'{path}\{itemtype}.csv',low_memory=False)
        
    columns = {'comments': 'body', 'submissions': 'selftext'}
    
    column = columns[itemtype]    
    
    df[column] = df[column].apply(lambda x: str(x).lower())
    
    df = pd.concat([df[df[column].str.contains(ticker.lower())], df[df[column].str.contains(TICKERS[ticker].lower())]],ignore_index=True)
    
    from nltk.corpus import stopwords
    additional  = ['rt','rts','retweet'] #we'll store additional stopwords here
    swords = set().union(stopwords.words('english'),additional) #big list containing all the stopwords + our additional ones
    df.drop_duplicates(subset=columns[itemtype],inplace=True)
    
    import nltk.sentiment.vader as vd
    
    sia = vd.SentimentIntensityAnalyzer()
    df.dropna(subset=[column],inplace=True)
    
    df['processed_text'] = df[column].str.lower()\
          .str.replace('(@[a-z0-9]+)\w+',' ')\
          .str.replace('(http\S+)', ' ')\
          .str.replace('([^0-9a-z \t])',' ')\
          .str.replace(' +',' ')\
          .apply(lambda x: [i for i in x.split() if not i in swords])
    
    from nltk.tokenize import word_tokenize
    
    df['sentiment_score'] = df['processed_text'].apply(lambda x: sum([ sia.polarity_scores(i)['compound'] for i in word_tokenize( ' '.join(x) )]) )
    
    df[['processed_text','sentiment_score']].sort_values(by='sentiment_score')
    
    sent_clasification = pd.cut(df['sentiment_score'],\
          [-3,-1.2, 0, 1.2 , 3],\
          right=True,\
          include_lowest=True,\
          labels=['stronglynegative', 'negative', 'positive', 'stronglypositive'])
    
    return dict(sent_clasification.value_counts())

def get_sentiment_aggregates(ticker):
    com_results = get_sentiment_data(ticker, 'comments' )
    sub_results = get_sentiment_data(ticker, 'submissions' )
    
    labels=['stronglynegative', 'negative', 'positive', 'stronglypositive']
    aggregation = {}
    
    for key in labels:
        try:
            aggregation[key] = str(com_results[key] + sub_results[key])
        except Exception as e:
            print(e)

    return aggregation