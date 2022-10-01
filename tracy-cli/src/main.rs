use tracy;

fn main() {
    println!("Hello, world!");
    let api = "https://lcd-juno.itastakers.com";
    // let _res = fetch_juno_pools(api).await.unwrap();
    let pool = JunoPool::new();
    let config = JunoPoolConfig {
        path: "juno_pools.json".to_string(),
        api: api.to_string(),
    };
    let token_in = "ujuno";
    let token_out = "uatom";
    let amount = 1000000;
    let quote = pool.get_quote(amount, token_in, token_out, config).await?;
    println!(
        "Price for {} {} -> {} {}",
        token_in, amount, token_out, quote.token_out
    );
}
