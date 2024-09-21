import axios from "axios";

const BASE_URL = "https://staging-1.cheqd.in";

export async function trainBodhiAndGeneratePreText(jwt, companyName) {
  try {
    const finalData = [];
    // 0. profile data
    const [profileData] = await getJsonData(
      BASE_URL + "/api/get_admin_details",
      jwt,
      undefined,
      "GET"
    );

    const profileStr = `Company name: ${companyName}:
  address: ${profileData.address}, ${profileData.company_city}, ${profileData.company_state_name}, ${profileData.company_country}
  gstin: ${profileData.gstin}
  `;
    finalData.push(profileStr);

    // 1. get sales data

    const salesData2223 = await getJsonData(
      BASE_URL + "/api/get_invoice_graph_data",
      jwt,
      {
        start_year: 2022,
        end_year: 2023,
      }
    );
    const salesData2324 = await getJsonData(
      BASE_URL + "/api/get_invoice_graph_data",
      jwt,
      {
        start_year: 2023,
        end_year: 2024,
      }
    );

    let salesStr = `
Sales data for financial year 2022-2023 in (month|amount) format:
  ${salesData2223
    .map((sale) => `${sale.month || "December"}|${sale.pending}`)
    .join("\n")}
  Sales data for financial year 2023-2024 in (month|amount) format:
  ${salesData2324
    .map((sale) => `${sale.month || "December"}|${sale.pending}`)
    .join("\n")}
  `;
    finalData.push(salesStr);
    // console.log(salesStr);

    // 1. get purchase data
    const purchaseData2223 = await getJsonData(
      BASE_URL + "/api/get_expense_graph_data",
      jwt,
      {
        start_year: 2022,
        end_year: 2023,
      }
    );
    const purchaseData2324 = await getJsonData(
      BASE_URL + "/api/get_expense_graph_data",
      jwt,
      {
        start_year: 2023,
        end_year: 2024,
      }
    );
    let purchaseStr = `
  purchase data for financial year 2022-2023 in (month|amount) format:
  ${purchaseData2223
    .map((purchase) => `${purchase.month || "December"}|${purchase.pending}`)
    .join("\n")}
  purchase data for financial year 2023-2024 in (month|amount) format:
  ${purchaseData2324
    .map((purchase) => `${purchase.month || "December"}|${purchase.pending}`)
    .join("\n")}
    `;
    finalData.push(purchaseStr);
    // console.log(purchaseStr);

    // 3. employee data
    const employeeData = await getJsonData(
      BASE_URL + "/api/get_employee_list",
      jwt,
      { page_no: 1, no_of_rows: 10, is_active: true }
    );
    const empStr = `
  Employee details of the company in (name|employee_id|designation|date of birth) format:
  ${employeeData
    .map(
      ({ emp_name, company_emp_id, designation, dob }) =>
        `${emp_name}|${company_emp_id}|${designation}|${dob}`
    )
    .join("\n")}`;

    finalData.push(empStr);
    // console.log(empStr);

    // 4. customer data
    const customerData = await getJsonData(
      BASE_URL + "/api/get_customer_details",
      jwt,
      {
        page_no: 1,
        no_of_rows: 50,
        fy: "2023-2024",
        search_text: null,
        sort_item: "",
      }
    );
    const custStr = `Customer/vendor details of the company in (name|city|Sales to this entity|Purchase from this entity) format:
${customerData
  .map(
    ({ name, billing_address_city, total_sales, total_purchases }) =>
      `${name}|${billing_address_city}|${total_sales}|${total_purchases}`
  )
  .join("\n")}`;

    finalData.push(custStr);

    // console.log(custStr);
    return finalData.join("\n\n");
  } catch (ex) {
    console.log(ex);
    return null;
  }
}

export async function getJsonData(url, jwt, body, method = "POST") {
  try {
    const { data } = await axios(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      data: body,
    });

    return data.results || data;
  } catch (e) {
    return [];
  }
}

/* async function downloadData(url, method = "POST", jwt, body) {
  try {
    const { data } = await axios(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `BEARER ${jwt}`,
      },
      responseType: "blob",
      data: body,
    });

    return data;
  } catch (e) {
    return [];
  }
} */
