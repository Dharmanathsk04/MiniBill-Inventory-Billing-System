package com.minibill.repository;

import com.minibill.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, UUID> {
    
    @Query("SELECT COUNT(i) FROM Invoice i")
    long getTotalInvoiceCount();
}