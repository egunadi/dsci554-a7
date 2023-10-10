import pandas as pd

def process_data():
    life_expectancy_filepath = '../data/life_expectancy.original.csv'
    wages_filepath = '../data/wages.original.csv'
    
    life_expectancy_df = pd.read_csv(life_expectancy_filepath, delimiter=',', encoding='utf-8')
    wages_df = pd.read_csv(wages_filepath, delimiter=',', encoding='utf-8')
    
    life_expectancy_df.loc[life_expectancy_df['Country or Area'] == 'United States of America',  
                           'Country or Area'] = 'United States'
    wages_df = wages_df[wages_df['Sex'].isin(['Men', 'Women'])]
    wages_df = wages_df.loc[~(
                                (wages_df['Country or Area'].isin(['Sri Lanka','United Kingdom']))
                                & (wages_df['Scope'] == 'Earnings per hour')
                            ), :]
    
    life_expectancy_df = life_expectancy_df[['Country or Area', 'Value']]
    
    wages_df = pd.pivot_table(wages_df, 
                              values = 'Value', 
                              index = ['Country or Area'],
                              columns = 'Sex').reset_index()
    wages_df['wage_ratio'] = (wages_df['Men'] / wages_df['Women'])
    wages_df = wages_df[['Country or Area', 'wage_ratio']]
    
    life_expectancy_df = life_expectancy_df.rename(columns={'Country or Area': 'name',
                                                            'Value': 'life_expectancy'})
    wages_df = wages_df.rename(columns={'Country or Area': 'name'})
    
    combined_df = life_expectancy_df.merge(wages_df, on='name')
    
    europe_list = ['Belarus', 'Sweden', 'Ukraine', 'United Kingdom']
    asia_list = ['Indonesia', 'Philippines', 'Singapore', 'Sri Lanka']
    america_list = ['Mexico', 'Paraguay']
    
    def get_continent(country):
        if country in europe_list:
            return 'Europe'
        if country in asia_list:
            return 'Asia'
        if country in america_list:
            return 'America'
        else:
            return 'None'
        
    combined_df['continent'] = combined_df['name'].apply(get_continent)

    combined_df.to_csv('../data/life_expectancy_and_wages.csv', encoding='utf-8', index=False)

if __name__ == '__main__':
    process_data()
    